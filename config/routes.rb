Rails.application.routes.draw do

  root  "users#show"
  
  # SIGNIN & SIGNOUT
  get   "/auth/:provider/callback" => "sessions#create"
  get   "/signout" => "sessions#destroy"

  resources :projects
  resources :tasks

end
