Rails.application.routes.draw do

  root  "users#show"
  
  # SIGNIN & SIGNOUT
  get   "/auth/:provider/callback" => "sessions#create"
  get   "/signout" => "sessions#destroy"

  post "/create_project" => "projects#create"
  get "/check_collaborator" => "projects#check_github_user"
  post "/create_subtask" => "tasks#create_subtask"
  delete "/remove_user" => "tasks#remove_user"
  post "/add_user" => "tasks#add_user"
  put "/set_order" => "tasks#set_order"

  resources :projects
  resources :tasks

end
