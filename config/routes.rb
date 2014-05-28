Rails.application.routes.draw do

  root  "users#show"
  
  # SIGNIN & SIGNOUT
  get   "/auth/:provider/callback" => "sessions#create"
  get   "/signout" => "sessions#destroy"

  post "/create_project" => "projects#create"

  resources :projects
  resources :tasks

end
