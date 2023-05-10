import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Mail from '@ioc:Adonis/Addons/Mail'
import Encryption from '@ioc:Adonis/Core/Encryption'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'

export default class AuthController {
  protected data: any = {};

  constructor(){
    this.data.title = process.env.APP_TITLE+"Login";
  }

  /**
   * Login page
   * parameter: view
   * return: login page view
   */
  public async index({view}: HttpContextContract) {
    var responseData = {
      test: "t1"
    };

    Object.assign(this.data, responseData);

    return view.render('auth', { data: this.data });
  }

  /**
   * Check Login
   * parameter: request, auth, response
   * return: response of user auth
   */
  public async checkLogin({request, auth, response, session}: HttpContextContract) {
    /* start: validation */
    const authSchema = schema.create({
      email: schema.string({}, [ rules.email()]),
      password: schema.string()
    });

    const messages = {
      'email.required': 'The {{ field }} is required',
      'password.required': 'The {{ field }} is required'
    };

    const validated = await request.validate({ schema: authSchema, messages: messages});
    /* end: validation */

    var user: any;
    if(validated){

      user = await User.query().select('id', 'name', 'email', 'role', 'status').where({email: validated.email, role: 1}).first();
      if(user){
          var authUser = await auth.use('web').attempt(validated.email, validated.password);
          if(authUser){
            session.put('userId', user.id);
            session.put('userName', user.name);
            session.put('userEmail', user.email);

            if(user.profile_img){
              session.put('userProfileImg', process.env.APP_ASSETS_URL+'/uploads/admin/'+user.profile_img);
            }else{
              session.put('userProfileImg', process.env.APP_ASSETS_URL+'/uploads/admin/default_profile_img.png');
            }

            response.redirect().toRoute('dashboard');
          }else{
            session.flash('message', 'Invalid Credentials');
            response.redirect().toRoute('login');
          }
      }else{
        session.flash('message', 'Invalid Credentials');
        response.redirect().toRoute('login');
      }
    }
  }

  /**
   * Logout
   * parameter: response, auth, session
   * returns: logout user and redirect to login page
   */
  public async logout({ response, auth, session }: HttpContextContract) {
    // logout the user
    await auth.logout();

    var userID = session.get('userID');
    if(userID){
      //delete token
      //await Database.from('api_tokens').where('id', userID).delete();

      // session
      await session.clear();

      //await Database.rawQuery('delete from api_tokens where id='+request.input('id'));
    }
    // redirect to login page
    return response.redirect().toRoute('login');
  }

  /**
   * Forgot password page
   * parameter: response, auth, session
   * returns: forgot password page
   */
  public async forgotPassword({ view }: HttpContextContract) {
    this.data.title = process.env.APP_TITLE+"Forgot password"
    return view.render('forgot-password', { data: this.data });
  }

   /**
   * Reset link send
   * parameter: response, auth, session
   * returns: send restlink
   */
   public async resetLinkSend({ request, session, response }: HttpContextContract) {

    /* start: validation */
    const authSchema = schema.create({
      email: schema.string({}, [ rules.email()]),
    });

    const messages = {
      'email.required': 'The {{ field }} is required',
    };

    const validated = await request.validate({ schema: authSchema, messages: messages});
    /* end: validation */

    var user: any;
    if(validated){
      user = await User.query().select('id', 'name', 'email', 'role', 'status').where({email: validated.email}).first();
      if(user){
        try{
          var userVerifyData = {
            'email': user.email
          };
          var encryptedData = Encryption.encrypt(userVerifyData, '1 hours');

          var passwordResetLink = process.env.APP_URL+'/reset-password/'+encryptedData;

         /* send mail */
         var fromSMTPEmail:any = process.env.SMTP_EMAIL;
         var mailSentAck = await Mail.send((message) => {
          message
            .from(fromSMTPEmail)
            .to(user.email)
            .subject('Reset Password Link')
            .htmlView('emails/reset-link', { name: user.name, passwordResetLink: passwordResetLink })
          });
          if(mailSentAck){
            session.flash('message', 'Please check your mail inbox for reset password link1');
            response.redirect().toRoute('forgot.password');
          }else{
            session.flash('message', 'Error');
            response.redirect().toRoute('forgot.password');
          }
         /* ./send mail */
        }catch(error){
          session.flash('message', error.message);
          response.redirect().toRoute('forgot.password');
        }

        session.flash('message', 'Please check your mail inbox for reset password link');
        response.redirect().toRoute('forgot.password');
      }else{
        session.flash('message', 'Provided email id is not registered with us');
        response.redirect().toRoute('forgot.password');
      }
    }
  }

  /**
   * Reset password page
   * parameter: request
   * returns: page show of reset password
   */
  public async resetPassword({ request, view }: HttpContextContract) {

    /* const authSchema = schema.create({
      password: schema.string()
    });

    const messages = {
      'password.required': 'The {{ field }} is required'
    };

    const validated = await request.validate({ schema: authSchema, messages: messages});


    var user: any;
    if(validated){
      user = await User.query().select('id', 'email', 'role', 'status').where({email: validated.email}).first();
      if(user){

      }
    } */
    try{
      console.log('Hello');
      var requestData = request.params();
      console.log('requestData: '+requestData);
      console.log('requestData link: '+requestData.link);
      //console.log('request data: '+ JSON.stringify(requestData));
      this.data.title = "Set Password";
      this.data.link = requestData.link;

      return view.render('set-password', this.data);
    }catch(error){
      console.log('error: '+ error);
    }
  }

 /**
   * Reseting password in table
   * parameter: request, response, session
   * returns: reset password and send response
   */
  public async resetingPassword({ request, response, session }: HttpContextContract){
    var ObjData:any = {};

    var linkData = request.input('link');
    var newPassword = request.input('new_password');
    var confirmPassword = request.input('confirm_new_password');
    if(!newPassword){
      session.flash('error', 'Password is required');
      return response.redirect().toRoute('reset.password', { link: linkData });
    }else if(!confirmPassword){
      session.flash('error', 'Confirm Password is required');
      return response.redirect().toRoute('reset.password', { link: linkData });
    }else if(newPassword !== confirmPassword){
      session.flash('error', 'Password and Confirm Password must match');
      return response.redirect().toRoute('reset.password', { link: linkData });
    }

    ObjData = Encryption.decrypt(linkData);
    if(!ObjData){
      session.put('error', "Password set link is expired" );
      return response.redirect().toRoute('reset.password', { link: linkData });
    }
    var email = ObjData.email;

    if(newPassword){
      var resetPwdSchema = schema.create({
        new_password: schema.string([
          rules.confirmed('confirm_new_password')
        ]),
        confirm_new_password: schema.string({trim: true}, [rules.minLength(2), rules.maxLength(50), rules.trim(), rules.escape()]),
      })

      var messages = {
        'new_password.required': 'New Password is required',
        'confirm_new_password.required': 'Confirm New Password is required',
        'confirm_new_password.confirmed': 'Password do not match'
      };

      var changePassowrdValidate = await request.validate({ schema: resetPwdSchema, messages });
      //console.log('changePassowrdValidate: '+changePassowrdValidate);
      if(changePassowrdValidate){
        try{
          let getRecord = await Database.query().from('users').where('email', email).select('id', 'email', 'password', 'role').first();

          if(getRecord){
            let updateAck = await User.query().where('id', getRecord.id).update({ 'password': await Hash.make(newPassword), 'updatedAt': new Date()});

            if(updateAck){
              session.flash('success', "Password set successfully" );
              return response.redirect().toRoute('reset.password', { link: linkData });
              //return response.json({ status: true, code: 200, data: updateAck, message: "Password reset Successfully" });
            }else{
              session.flash('error', "Something went wrong" );
              return response.redirect().toRoute('reset.password', { link: linkData });
            }
          }else{
            session.flash('error', "No record found relevant to provided email" );
            return response.redirect().toRoute('reset.password', { link: linkData });
          }
        }catch(error){
          session.flash('error', "Something went wrong" );
          return response.redirect().toRoute('reset.password', { link: linkData });
        }
      }else{
        session.flash('error', changePassowrdValidate);
        return response.redirect().toRoute('reset.password', { link: linkData });
      }
    }
  }
}
