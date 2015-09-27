# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140609022245) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "nested_tasks", force: :cascade do |t|
    t.integer "task_id"
    t.integer "subtask_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string   "name"
    t.string   "description"
    t.date     "begin_date"
    t.date     "end_date"
    t.boolean  "master_status"
    t.boolean  "dev_status"
    t.string   "author"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "repository_id"
  end

  create_table "projects_users", id: false, force: :cascade do |t|
    t.integer "project_id", null: false
    t.integer "user_id",    null: false
  end

  create_table "tasks", force: :cascade do |t|
    t.string   "branch_name"
    t.string   "user_story"
    t.date     "due_date"
    t.integer  "status"
    t.integer  "priority"
    t.string   "stage"
    t.integer  "project_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "parent_id"
    t.time     "last_commit"
  end

  add_index "tasks", ["project_id"], name: "index_tasks_on_project_id", using: :btree

  create_table "tasks_users", id: false, force: :cascade do |t|
    t.integer "task_id", null: false
    t.integer "user_id", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "username"
    t.string   "avatar_url"
    t.string   "github_access_token"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
