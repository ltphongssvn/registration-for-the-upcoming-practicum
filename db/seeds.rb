# File: db/seeds.rb
# Location: /registration-for-the-upcoming-practicum/db/seeds.rb

# Clear existing data
Student.destroy_all

# Seed students with varied practicum ideas
students_data = [
  { name: "Alice Chen", email: "alice@example.com", cohort: "Winter 2025",
    practicum_idea: "AI-powered study assistant with flashcard generation using NLP",
    availability: true, completed_prerequisites: true },
  { name: "Bob Smith", email: "bob@example.com", cohort: "Winter 2025",
    practicum_idea: "Mobile fitness tracker with social challenges",
    availability: true, completed_prerequisites: false },
  { name: "Carol Davis", email: "carol@example.com", cohort: "Fall 2024",
    practicum_idea: "Community forum for local volunteer opportunities",
    availability: false, completed_prerequisites: true },
  { name: "David Lee", email: "david@example.com", cohort: "Winter 2025",
    practicum_idea: "Budget management app with expense visualization",
    availability: true, completed_prerequisites: true },
  { name: "Emma Wilson", email: "emma@example.com", cohort: "Winter 2025",
    practicum_idea: "Recipe sharing platform with AI recommendations",
    availability: true, completed_prerequisites: true },
  { name: "Frank Garcia", email: "frank@example.com", cohort: "Fall 2024",
    practicum_idea: "Real-time chat application with video calls",
    availability: true, completed_prerequisites: false },
  { name: "Grace Kim", email: "grace@example.com", cohort: "Winter 2025",
    practicum_idea: "Educational quiz app with progress tracking",
    availability: true, completed_prerequisites: true },
  { name: "Henry Johnson", email: "henry@example.com", cohort: "Winter 2025",
    practicum_idea: "Health monitoring dashboard with wearable integration",
    availability: false, completed_prerequisites: true }
]

students_data.each do |data|
  Student.create!(data)
end

puts "Seeded #{Student.count} students"
