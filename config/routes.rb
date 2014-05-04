Rails.application.routes.draw do

  root  "sessions#index"
  
  # SIGNIN & SIGNOUT
  get   "/auth/:provider/callback" => "sessions#create"
  get   "/signout" => "sessions#destroy"

  get   "/:username" => "users#show"

end
