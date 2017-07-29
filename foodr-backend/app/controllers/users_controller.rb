class UsersController < ApplicationController
  def show
  end

  def create
    p params.to_s
    user = User.new(email: params[:email], password: params[:password])
    if user.save
      render json: {
        saved: true,
        user: user
      }.to_json
    else
      render json: {
        saved: false,
        errors: user.errors.full_messages
      }.to_json
    end
  end

end