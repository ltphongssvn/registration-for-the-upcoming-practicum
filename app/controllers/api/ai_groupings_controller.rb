# File: app/controllers/api/ai_groupings_controller.rb
# Location: /registration-for-the-upcoming-practicum/app/controllers/api/ai_groupings_controller.rb

module Api
  class AiGroupingsController < ApplicationController
    def analyze
      students = Student.where(completed_prerequisites: true, availability: true)
      service = AiGroupingService.new

      groups = service.analyze_student_ideas(students)

      render json: {
        groups: groups,
        total_students: students.count,
        analyzed_at: Time.current
      }
    end

    def suggest_teams
      students = Student.where(completed_prerequisites: true, availability: true)
      team_size = params[:team_size]&.to_i || 5
      service = AiGroupingService.new

      teams = service.suggest_teams(students, team_size: team_size)

      render json: {
        teams: teams,
        team_size: team_size,
        total_students: students.count
      }
    end
  end
end
