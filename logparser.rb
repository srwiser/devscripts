#!/usr/bin/env ruby

class LogFileParser

    def initialize path
        raise ArgumentError unless File.exists?( path )

        @logfile = path
    end

    def parse
            result = `ruby -lane 'puts $F.values_at(8,9).join( \"\ \" )' #{@logfile} | sort| grep -E '4[0-9][0-9]\|5[0-9][0-9]' | uniq -c`
            date = Time.now.strftime('%Y%m%d')
            filename = "parsed-#{date}"
            resultfile = File.open("#{filename}", 'w')
            resultfile.write(result)
            resultfile.close
    end

    log = LogFileParser.new( *ARGV )

    log.parse
end
            
