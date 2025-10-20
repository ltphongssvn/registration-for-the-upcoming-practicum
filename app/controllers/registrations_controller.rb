# File: app/controllers/registrations_controller.rb
# Location: /registration-for-the-upcoming-practicum/app/controllers/registrations_controller.rb
class RegistrationsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create], if: :json_request?

  def index
    @students = Student.all.order(created_at: :desc)

    respond_to do |format|
      format.html
      format.json { render json: @students }
    end
  end

  def new
    @student = Student.new
  end

  def create
    @student = Student.new(student_params)

    respond_to do |format|
      if @student.save
        format.html { redirect_to registration_path(@student), notice: "Registration successful!" }
        format.json { render json: @student, status: :created }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: { errors: @student.errors }, status: :unprocessable_entity }
      end
    end
  end

  def show
    @student = Student.find(params[:id])
  end

  private

  def student_params
    params.require(:student).permit(:name, :email, :cohort, :practicum_idea,
                                    :availability, :completed_prerequisites)
  end

  def json_request?
    request.format.json?
  end
end
