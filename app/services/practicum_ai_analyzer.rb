# File: app/services/practicum_ai_analyzer.rb
class PracticumAiAnalyzer
  def self.analyze_and_group(students)
    idea_categories = {
      'ai_ml' => ['ai', 'machine learning', 'nlp', 'neural', 'recommendation'],
      'social' => ['chat', 'forum', 'community', 'social', 'sharing'],
      'health' => ['health', 'fitness', 'wellness', 'medical', 'tracker'],
      'education' => ['study', 'quiz', 'learning', 'flashcard', 'educational'],
      'finance' => ['budget', 'expense', 'money', 'financial', 'payment'],
      'productivity' => ['task', 'dashboard', 'monitoring', 'management', 'visualization']
    }

    grouped = Hash.new { |h, k| h[k] = [] }

    students.each do |student|
      next unless student.practicum_idea
      idea_lower = student.practicum_idea.downcase

      category = idea_categories.find { |_, keywords|
        keywords.any? { |kw| idea_lower.include?(kw) }
      }&.first || 'other'

      grouped[category] << student
    end

    similarity_scores = calculate_similarity_matrix(students)

    {
      grouped_by_category: grouped,
      similarity_scores: similarity_scores,
      recommended_teams: suggest_teams(grouped, students)
    }
  end

  private

  def self.calculate_similarity_matrix(students)
    students.map do |s1|
      students.map do |s2|
        next 0 if s1.id == s2.id
        score = 0
        score += 0.3 if s1.cohort == s2.cohort
        score += 0.3 if s1.availability == s2.availability
        score += 0.4 if similar_ideas?(s1.practicum_idea, s2.practicum_idea)
        score
      end
    end
  end

  def self.similar_ideas?(idea1, idea2)
    return false unless idea1 && idea2
    common_words = idea1.downcase.split & idea2.downcase.split
    common_words.size >= 2
  end

  def self.suggest_teams(grouped, students)
    teams = []
    grouped.each do |category, members|
      ready_members = members.select { |m| m.availability && m.completed_prerequisites }
      ready_members.each_slice(4) { |team| teams << { category: category, members: team.map(&:name) } }
    end
    teams
  end
end
