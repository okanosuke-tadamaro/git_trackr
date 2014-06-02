class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :username
      t.string :avatar_url
      t.string :github_access_token

      t.timestamps
    end
  end
end
