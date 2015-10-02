Rails.application.routes.draw do

  root 'projects#index'

  # SIGNIN & SIGNOUT
  # get "/auth/:provider/callback" => "sessions#create"
  post '/login' => 'sessions#create'
  get "/logout" => "sessions#destroy"
  get "/guide" => "sessions#guide"
  get "/welcome" => 'static_pages#splash', as: :splash

  post "/create_project" => "projects#create"
  get "/check_collaborator" => "projects#check_github_user"
  post "/create_subtask" => "tasks#create_subtask"
  delete "/remove_user" => "tasks#remove_user"
  post "/add_user" => "tasks#add_user"
  put "/set_order" => "tasks#set_order"
  put "/update_story" => "tasks#update_story"

  resources :users, :only => [:create, :show]
  resources :projects
  resources :tasks

end
