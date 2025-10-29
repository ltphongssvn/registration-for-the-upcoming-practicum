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

  def cohorts
    current_year = Date.current.year
    current_month = Date.current.month
    cohorts = []

    (current_year - 9..current_year).each do |year|
      seasons = ['Winter', 'Spring', 'Summer', 'Fall']

      # For current year, only include seasons up to current one
      if year == current_year
        current_season_index = case current_month
                               when 1..2 then 0  # Winter
                               when 3..5 then 1  # Spring
                               when 6..8 then 2  # Summer
                               else 3            # Fall
                               end
        seasons = seasons[0..current_season_index]
      end

      seasons.each do |season|
        cohorts << "#{season} #{year}"
      end
    end

    render json: { cohorts: cohorts.reverse }
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
