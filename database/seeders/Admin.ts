import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        name: 'Admin',
        email: 'tc@mailinator.com',
        password: await Hash.make('123456789'),
        role: 1,
        status: 1,
      }
    ]);
  }
}
