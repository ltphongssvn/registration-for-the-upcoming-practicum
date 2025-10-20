# File: app/controllers/api/students_controller.rb
class Api::StudentsController < ApplicationController
  def index
    students = Student.all.order(created_at: :desc)
    ai_analysis = PracticumAiAnalyzer.analyze_and_group(students)

    render json: {
      students: students,
      stats: {
        total: students.count,
        available: students.where(availability: true).count,
        prerequisites_completed: students.where(completed_prerequisites: true).count,
        ready_for_practicum: students.where(availability: true, completed_prerequisites: true).count
      },
      ai_grouping: ai_analysis[:grouped_by_category].transform_values { |v| v.map(&:name) },
      suggested_teams: ai_analysis[:recommended_teams]
    }
  end
end
