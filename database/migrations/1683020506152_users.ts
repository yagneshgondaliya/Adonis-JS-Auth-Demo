import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('email')
      table.string('password')
      table.string('role').defaultTo(2).comment('1=Admin user, 2=Normal user')
      table.integer('status').defaultTo(1).comment('1=Active, 2=Inactive')
      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
