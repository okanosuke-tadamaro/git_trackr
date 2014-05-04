class User < ActiveRecord::Base

  def self.oauth_link
    return "https://github.com/login/oauth/authorize?client_id=#{ENV['GITHUB_CLIENT_ID']}"
  end

  def self.parse_github_callback(code)
    return JSON.parse(RestClient.post("https://github.com/login/oauth/access_token", {client_id: ENV['GITHUB_CLIENT_ID'], client_secret: ENV['GITHUB_CLIENT_SECRET'], code: code}, { accept: :json }))
  end

  def self.new_github_client(access_token)
    return Octokit::Client.new :access_token => access_token
  end

end
