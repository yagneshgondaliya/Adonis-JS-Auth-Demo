import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DashboardController {

  protected data: any = {};

  constructor(){
    this.data.title = process.env.APP_TITLE+"Dashboard";
  }

  /**
   * Check Login
   * parameter: view
   * return: response of user auth
   */
  public async index({view}: HttpContextContract) {

    var responseData = {
      test: "Test Dashboard"
    };

    Object.assign(this.data, responseData);

    return view.render('dashboard', { data: this.data });
  }
}
