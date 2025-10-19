# File: app/models/student.rb
# Location: /registration-for-the-upcoming-practicum/app/models/student.rb

class Student < ApplicationRecord
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :cohort, presence: true
  validates :practicum_idea, presence: true
  validates :availability, inclusion: { in: [true, false] }
  validates :completed_prerequisites, inclusion: { in: [true, false] }

  scope :available, -> { where(availability: true) }
  scope :completed, -> { where(completed_prerequisites: true) }
end
