class HomeController < ApplicationController
  require 'net/http'
  require 'json'

  def index
    url = URI('http://ip-api.com/json/')
    response = Net::HTTP.get(url)
    @ip = JSON.parse(response)['query']
  end
end