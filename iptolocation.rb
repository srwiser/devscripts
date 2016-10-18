require 'csv'
require 'rest-client'
require 'json'
count = 0
CSV.foreach("iref_users_ip.csv", {:headers => true}) do |row|
	ip = row[1]
	email = row[0]
	url = "http://freegeoip.net/json/#{ip}"
	#url = "http://api.ipinfodb.com/v3/ip-city/?key=ed850a6ad5fcc9698486bb103f5ca5b5981724288d482e7d245f41bf5b58b873&ip=#{ip}&format=json"
	response = RestClient.get(url)
	loc = JSON.parse(response)
	city = loc["city"]
	region = loc["region_name"]
	zipcode = loc["zip_code"]
	CSV.open("ip_location.csv", "a") do |csv|
		csv << ["#{email}","#{ip}","#{city}","#{region}","#{zipcode}"]
	end
	count = count+1
	puts count
	if count > 9000
		sleep 1800
	else
		continue
	end
	
end
