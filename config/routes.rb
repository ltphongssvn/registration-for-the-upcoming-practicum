# File: config/routes.rb
# Location: /registration-for-the-upcoming-practicum/config/routes.rb

Rails.application.routes.draw do
  root "registrations#index"

  resources :registrations, only: [:index, :new, :create, :show] do
    collection do
      get :cohorts
    end
  end

  namespace :api do
    resources :students, only: [:index]
    post 'ai_groupings/analyze', to: 'ai_groupings#analyze'
    post 'ai_groupings/suggest_teams', to: 'ai_groupings#suggest_teams'
  end

  get "up" => "rails/health#show", as: :rails_health_check
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
end
