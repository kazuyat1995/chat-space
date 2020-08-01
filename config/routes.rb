Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root "groups#index"
  resources :users, only: %i[index edit update]
  resources :groups, only: %i[new create edit update] do
    resources :messages, only: %i[index create]
    # namespace :ディレクトリ名 do ~ endと囲む形でルーティングを記述すると、そのディレクトリ内のコントローラのアクションを指定できる。
    # controllersディレクトリ直下にさらにディレクトリを作成した場合、ルーティングをそれに対応させるための書き方。 namespace :ディレクトリ名 do ~ end
    namespace :api do
      resources :messages, only: :index, defaults: { format: 'json' }
    end
  end
end
