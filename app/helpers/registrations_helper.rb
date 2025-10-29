# File: app/helpers/registrations_helper.rb
# Location: /registration-for-the-upcoming-practicum/app/helpers/registrations_helper.rb
module RegistrationsHelper
  def cohort_options
    current_year = Date.current.year
    cohorts = []

    # Generate cohorts for last 10 years (2015-2025)
    (current_year - 9..current_year + 1).each do |year|
      # Generate 4 quarters per year
      ['Winter', 'Spring', 'Summer', 'Fall'].each do |season|
        # Each cohort can have different tracks
        ['Rails', 'React/Node', 'Full Stack', 'Data Science', 'Mobile', 'DevOps'].each do |track|
          cohorts << "#{season} #{year} - #{track}"
        end
      end
    end

    cohorts.reverse # Most recent first
  end
end
