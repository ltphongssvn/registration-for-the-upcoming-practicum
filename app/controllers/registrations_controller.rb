# File: app/controllers/registrations_controller.rb
# Location: /registration-for-the-upcoming-practicum/app/controllers/registrations_controller.rb

class RegistrationsController < ApplicationController
  def index
    @students = Student.all.order(created_at: :desc)
  end

  def new
    @student = Student.new
  end

  def create
    @student = Student.new(student_params)

    if @student.save
      redirect_to registration_path(@student), notice: "Registration successful!"
    else
      render :new, status: :unprocessable_entity
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
end
