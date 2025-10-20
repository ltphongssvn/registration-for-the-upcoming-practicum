# File: app/services/ai_grouping_service.rb
# Location: /registration-for-the-upcoming-practicum/app/services/ai_grouping_service.rb

require 'net/http'
require 'json'

class AiGroupingService
  def initialize
    @openai_key = ENV['OPENAI_API_KEY']
    @anthropic_key = ENV['ANTHROPIC_API_KEY']
  end

  def analyze_student_ideas(students)
    return [] if students.empty?

    prompt = build_analysis_prompt(students)

    # Try OpenAI first, fallback to Anthropic
    result = call_openai(prompt) || call_anthropic(prompt)

    parse_grouping_result(result, students)
  end

  def suggest_teams(students, team_size: 5)
    return [] unless students.count >= team_size

    prompt = build_team_prompt(students, team_size)
    result = call_openai(prompt) || call_anthropic(prompt)

    parse_team_result(result, students)
  end

  private

  def build_analysis_prompt(students)
    ideas = students.map { |s| "Student #{s.id}: #{s.practicum_idea}" }.join("\n")

    <<~PROMPT
      Analyze these practicum project ideas and group them by similarity.
      Consider: technology stack, problem domain, features, and user base.

      #{ideas}

      Return JSON array of groups:
      [{"category": "name", "student_ids": [1,2,3], "similarity_reason": "why"}]
    PROMPT
  end

  def build_team_prompt(students, size)
    data = students.map do |s|
      "ID #{s.id}: #{s.cohort}, Idea: #{s.practicum_idea}"
    end.join("\n")

    <<~PROMPT
      Form balanced teams of #{size} students for practicum.
      Consider: cohort diversity, complementary ideas, skill balance.

      #{data}

      Return JSON array:
      [{"team_number": 1, "student_ids": [1,2,3,4,5], "rationale": "why"}]
    PROMPT
  end

  def call_openai(prompt)
    return nil unless @openai_key

    uri = URI('https://api.openai.com/v1/chat/completions')
    request = Net::HTTP::Post.new(uri)
    request['Authorization'] = "Bearer #{@openai_key}"
    request['Content-Type'] = 'application/json'
    request.body = {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    }.to_json

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    JSON.parse(response.body).dig('choices', 0, 'message', 'content')
  rescue => e
    Rails.logger.error("OpenAI API error: #{e.message}")
    nil
  end

  def call_anthropic(prompt)
    return nil unless @anthropic_key

    uri = URI('https://api.anthropic.com/v1/messages')
    request = Net::HTTP::Post.new(uri)
    request['x-api-key'] = @anthropic_key
    request['anthropic-version'] = '2023-06-01'
    request['Content-Type'] = 'application/json'
    request.body = {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    }.to_json

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    JSON.parse(response.body).dig('content', 0, 'text')
  rescue => e
    Rails.logger.error("Anthropic API error: #{e.message}")
    nil
  end

  def parse_grouping_result(result, students)
    return fallback_grouping(students) unless result

    JSON.parse(extract_json(result))
  rescue JSON::ParserError
    fallback_grouping(students)
  end

  def parse_team_result(result, students)
    return [] unless result

    JSON.parse(extract_json(result))
  rescue JSON::ParserError
    []
  end

  def extract_json(text)
    # Extract JSON from markdown code blocks or plain text
    text.match(/```json\n(.*?)\n```/m)&.[](1) ||
    text.match(/\[.*\]/m)&.[](0) ||
    text
  end

  def fallback_grouping(students)
    # Simple keyword-based fallback
    keywords = {
      'AI' => ['ai', 'machine learning', 'nlp', 'gpt'],
      'Social' => ['social', 'community', 'forum', 'chat'],
      'Finance' => ['budget', 'expense', 'finance', 'money'],
      'Health' => ['health', 'fitness', 'wellness', 'medical'],
      'Education' => ['education', 'learning', 'study', 'quiz']
    }

    groups = Hash.new { |h, k| h[k] = [] }

    students.each do |student|
      idea = student.practicum_idea.downcase
      category = keywords.find { |_, words| words.any? { |w| idea.include?(w) } }&.first || 'Other'
      groups[category] << student.id
    end

    groups.map { |cat, ids| { 'category' => cat, 'student_ids' => ids } }
  end
end
