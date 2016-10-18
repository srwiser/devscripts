from scrapy.selector import Selector
import json
import sys
import requests
import threading
import urllib2
import time
import csv
import string

final_dump=[]

# start_url = 'http://www.magicbricks.com/property-for-sale/residential-real-estate?proptype=Multistorey-Apartment,Studio-Apartment&cityName=Hyderabad&BudgetMin=%3E-5-crores'

def fun(spec_url):
    # if spec_url[0] == '/':
    #     spec_url = 'http://www.magicbricks.com' + spec_url
    # #spec_url  = u'1234567890-/:;()$&@".,?!\'[]{}#%^*+=_\|~<>\u20ac\xa3\xa5\u2022.,?!\''
    # urllib2.quote(spec_url.encode("utf8"))
    time.sleep(2)
    response = requests.get(spec_url).text
    # print response
    html = Selector(text=response)
    print spec_url
    properties = html.xpath('//div[@class="srpBlockWrapper"]')
    # print properties
    obj = {}
    for i in range(1,11):
        if i not in obj:
            obj.update({i:{}})
        # print i
        rating = html.xpath('//div[@class="srpBlockWrapper"]/div[@class="srpBlock"]['+str(i)+']/div[1]/div[1]/div[1]/div')
        if len(rating) > 2:    

            try:
                obj[i]['Name'] = html.xpath('//div[@class="srpBlockWrapper"]/div[@class="srpBlock"]['+str(i)+']/div[1]/div[1]/div[1]/div[2]/p[1]/strong/text()')[0].extract().strip()
            except:
                obj[i]['Name'] = 'N/A'
            # print obj['Name']
      
            try:
                obj[i]['Firm'] = html.xpath('//div[@class="srpBlockWrapper"]/div[@class="srpBlock"]['+str(i)+']/div[1]/div[1]/div[1]/div[2]/p[2]/text()')[0].extract().strip()
            except:
                obj[i]['Firm'] = 'N/A'
        
        elif len(rating) <= 2:

            try:
                obj[i]['Name'] = html.xpath('//div[@class="srpBlockWrapper"]/div[@class="srpBlock"]['+str(i)+']/div[1]/div[1]/div[1]/div[1]/p[1]/strong/text()')[0].extract().strip()
            except:
                obj[i]['Name'] = 'N/A'
            # print obj['Name']
      
            try:
                obj[i]['Firm'] = html.xpath('//div[@class="srpBlockWrapper"]/div[@class="srpBlock"]['+str(i)+']/div[1]/div[1]/div[1]/div[1]/p[2]/text()')[0].extract().strip()
            except:
                obj[i]['Firm'] = 'N/A'

        try:
            obj[i]['Price'] = html.xpath('//div[@class="srpBlockWrapper"]/div[@class="srpBlock"]['+str(i)+']/div[1]/div[1]/div[2]/div[1]/span[2]/text()')[0].extract().strip()
        except:
            obj[i]['Price'] = 'N/A'
      
        # try:
        #     obj[i]['Area'] = html.xpath('//div[@class="srpBlockWrapper"]/div[1]/div['+str(i)+']/div[1]/div[3]/div[1]/p/span/text()')[0].extract().strip()
        # except:
        #     obj[i]['Area'] = 'N/A'
        
        try:
            obj[i]['Location'] = html.xpath('//div[@class="srpBlockWrapper"]/div[@class="srpBlock"]['+str(i)+']/div[1]/div[2]/div[1]/text()')[1].extract().strip().replace("\n","")
        except:
            obj[i]['Location'] = 'N/A'

        try:
            obj[i]['Pocession'] = html.xpath('//div[@class="srpBlockWrapper"]/div[@class="srpBlock"]['+str(i)+']/div[1]/div[2]/div[2]/text()')[1].extract().strip().replace("\n","")
        except:
            obj[i]['Pocession'] = 'N/A'

        
        # try:
  	     #    obj[i]['Lead_type'] = html.xpath('//div[@class="srpBlockWrapper"]/div[1]/div['+str(i)+']/div[4]/div[1]/ul/li/a/text()')[0].extract().strip().split()[-1]
        # except:
  	     #    obj[i]['Lead_type'] = 'N/A'
    
    # print obj
    obj_list = []
    for (key,value) in obj.items():
        obj_list.append(value)
    # print obj_list
    return obj_list
      

def dump_page(start_url):
    global final_dump
    # response = requests.get(start_url).text
    # html = Selector(text=response)
    # properties = html.xpath('//div[@class="srpBlock srpContentImageWrap "]')
    # print len(properties)
    # for p_detail in properties:
    #     obj = {}
    #     try:
    #         final_dump.append(fun(start_url))
    #         # obj['Name'] = xpath('.//div[@class="seeProDetail"]/a/@href')[0].extract()))
    #     except Exception as e:
    #         print e
    #         pass
    try:
        final_dump.extend(fun(start_url))
        # obj['Name'] = xpath('.//div[@class="seeProDetail"]/a/@href')[0].extract()))
    except Exception as e:
        print e
        pass

    # properties = html.xpath('//div[@class="srpBlock srpContentImageWrap "]')
    # # print len(properties)
    # # for p_detail in properties:
    # #     obj = {}
    # #     try:
    # #         final_dump.append(fun(start_url))
    # #         # obj['Name'] = xpath('.//div[@class="seeProDetail"]/a/@href')[0].extract()))
    # #     except Exception as e:
    # #         print e
    # #         pass
    
    # try:
    #     final_dump.append(fun(start_url))
    #     # obj['Name'] = xpath('.//div[@class="seeProDetail"]/a/@href')[0].extract()))
    # except Exception as e:
    #     print e
    #     pass
    

    

def number_of_pages(start_url):
    try: 
        response = requests.get(start_url).text
        html = Selector(text=response)
        #pages = int(html.xpath('//div[@class="fl padding4 margin2"]/strong/text()')[-1].extract())
        pages = 150
	print pages
        return pages
    except:
        return 0


def dump_pages(start_url, filename):
    global final_dump
    final_dump = []
    pages = number_of_pages(start_url+"1") 
    threads = []
    for page in range(1,pages+1):
        threads.append(
            threading.Thread(target=dump_page, args=[start_url + str(page)]))
    concurrent = 10
    size = len(threads) / concurrent + 1
    for i in range(size):
        todo = threads[i * concurrent:(i + 1) * concurrent]
        for t in todo:
            t.start()
        for t in todo:
            t.join()

    f = open(filename, 'w')
    # print len(final_dump),'----',final_dump
    f.write(json_csv(final_dump))
    f.close()



def json_csv(data):
    keys = []
    csv_data = ''
    for item in data:
        for key in item:
            keys.append(key.encode('utf-8'))
    keys = list(set(keys))
    csv_data += '"%s"\n' % '","'.join(keys)
    for row in data:
        values = []
        for key in keys:
            values.append((row.get(key.decode('utf-8')) or "N/A")
                          .encode('utf-8'))
        csv_data += '"%s"\n' % '","'.join(values)
    return csv_data

reader = csv.reader(open('magic_tier1.csv'))
for row in reader:
    city = row[0]
    # start_url = 'http://www.magicbricks.com/property-for-sale/residential-real-estate?proptype=Multistorey-Apartment,Builder-Floor-Apartment,Penthouse,Studio-Apartment&cityName=' + str(city) + '/Page-'
    start_url = 'http://www.magicbricks.com/Real-estate-projects-search/Multistorey-Apartment-new-project-' + str(city) + '?Keyword=Eg.%20Project,%20Builder,%20Amenities%20etc./Page-'
    dump_pages(start_url,'magic_np_'+city+'.csv')
    # start_url = 'http://www.magicbricks.com/property-for-rent/residential-real-estate?proptype=Multistorey-Apartment,Builder-Floor-Apartment,Penthouse,Studio-Apartment&cityName=' + str(city) + '/Page-'
    # dump_pages(start_url,'magic_rent_'+city+'.csv')
    # sleep(300)
