import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IsAdmin {
  public async handle({session, response}: HttpContextContract, next: () => Promise<void>) {

    if(!session.has('userId')){
      return response.redirect().toRoute('login');
    }

    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
