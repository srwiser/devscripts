namespace :db do
  require 'csv'
  desc "Load City , Locality Data"

  task :city_data => :environment do
    csv_file_path = '/Users/vishwas/Documents/Rails_project/vishwas-garg/party_pedia_app/db/csv/city.csv'
    City.destroy_all()
    CSV.foreach(csv_file_path) do |row|
      p = City.create!({
                           :name => row[0],
                           :populairty_index => row[1],
                       }
      )
    end
  end

task :locality_data => :environment do
    csv_file_path = '/Users/vishwas/Documents/Rails_project/vishwas-garg/party_pedia_app/db/csv/Localities.csv'
    Locality.destroy_all()
    CSV.foreach(csv_file_path) do |row|
      city = City.where(name: row[2])
      city_id = city.nil? ? nil : city[0].id
      complete_name = (row[0])+","+(row[1])+","+(city[0].name)
      p = Locality.create!({
                           :locality => row[0],
                           :region => row[1],
                           :city_id => city_id,
                           :full_name => complete_name,
                           :populairty_index => 9,
                       }
      )
    end
  end


end
