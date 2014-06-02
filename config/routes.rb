Rails.application.routes.draw do

  root  "users#show"
  
  # SIGNIN & SIGNOUT
  get   "/auth/:provider/callback" => "sessions#create"
  get   "/signout" => "sessions#destroy"

  post "/create_project" => "projects#create"
  get "/check_collaborator" => "projects#check_github_user"

  resources :projects
  resources :tasks

end
