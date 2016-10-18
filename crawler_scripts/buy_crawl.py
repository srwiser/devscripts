from scrapy.selector import Selector
import json
import sys
import requests
import threading

final_dump = []


def fun(spec_url):
    spec_url = "http://www.99acres.com" + spec_url
    #spec_url = "http://www.99acres.com" + "/2-bhk-bedroom-apartment-flat-for-sale-in-jp-symphony-ambernath-mumbai-beyond-thane-998-sq-ft-spid-Q21539763"
    global count
    response = requests.get(spec_url).text
    html = Selector(text=response)
    print spec_url
    obj = {}

    try:
        obj['url'] =  spec_url
    except:
        obj['url'] = 'N/A'

    try:
        title = html.xpath(
            '//h1[@class="prop_seo_head f16 b"]/text()')[0].extract()
        location = title.split(' in ')[1].strip().split(',')
        if len(location) == 2:
            obj['area']  = location[0]
            obj['society'] = 'N/A'
            print obj['area']
        elif len(location) == 3:
            obj['society'] = location[0]
            obj['area'] = (location[1] + ", " + location[2]).strip()
        else:
            obj['area'] = 'N/A'
            obj['society'] = 'N/A'
    except:
        obj['area'] = 'N/A'
        obj['society'] = 'N/A'
#Lat-Lng
    try:
	lat = html.xpath('//input[@id="lat"]/@value')[0].extract()
	str(lat)
	obj['lat']= lat
    except:
        obj['lat'] = 'N/A'

    try:
        lng = html.xpath('//input[@id="lng"]/@value')[0].extract()
        str(lng)
        obj['lng']= lng
    except:
        obj['lng'] = 'N/A'

    try:
        address = html.xpath(
            '//div[@class="fwn f13 addPdElip"]/text()')[0].extract()
        obj['address'] = address.split(':')[1].strip().replace('"', '')
    except:
        obj['address'] = 'N/A'

    try:
        obj['price'] = html.xpath(
            '//span[@class="bsp"]/span[@class="redPd b"]/text()')[1].extract()
    except:
        obj['price'] = 'N/A'

    try:
        obj['pricePerSqFt'] = html.xpath(
            '//span[@class="bsp"]/span[@id="price_per_unit_areaLabel"]/text()')[0].extract().strip()
    except:
        obj['pricePerSqFt'] = 'N/A'

    try:
        builtUpArea = html.xpath(
            '//i[@id="builtupArea_span"]/text()')[0].extract()
        obj['builtuparea'] = builtUpArea.split(':')[1].strip()
    except:
        obj['builtuparea'] = 'N/A'
    
    try:
        builtupareaUnit = html.xpath('//span[@id="builtupAreaLabel"]/text()')[0].extract()
        str(builtupareaUnit)
        obj['builtupareaUnit'] = builtupareaUnit
    except:
        obj['builtupareaUnit'] = 'N/A'    

    try:
        superbuiltupArea = html.xpath(
            '//i[@id="superbuiltupArea_span"]/text()')[0].extract()
        obj['superbuiltuparea'] = superbuiltupArea.split(':')[1].strip()
    except:
        obj['superbuiltuparea'] = 'N/A'

    try:
        superbuiltupareaUnit = html.xpath('//span[@id="superbuiltupAreaLabel"]/text()')[0].extract()
        str(superbuiltupareaUnit)
        obj['superbuiltupareaUnit'] = superbuiltupareaUnit
    except:
        obj['superbuiltupareaUnit'] = 'N/A'

    try:
        carpetArea = html.xpath('//b[@id="carpetArea_span"]/text()')[0].extract()
        obj['carpetarea'] = carpetArea.split(':')[1].strip()
    except:
        obj['carpetarea'] = 'N/A'

    try:
        carpetareaUnit = html.xpath('//span[@id="carpetAreaLabel"]/text()')[0].extract()
        str(carpetareaUnit)
        obj['carpetareaUnit'] = carpetareaUnit
    except:
        obj['carpetareaUnit'] = 'N/A'

    try:
        areaRange = html.xpath(
            '//i[@id="areaRange"]/text()')[0].extract()
        obj['areaRange'] = areaRange.split(':')[1].strip()
    except:
        obj['areaRange'] = 'N/A'

    try:
        areaRangeUnit = html.xpath('//i[@class="bdr4 r5 hp5 cPin bLink addPdElipArLyr"]/text()')[0].extract()
        str(areaRangeUnit)
        obj['areaRangeUnit'] = areaRangeUnit
    except: 
        obj['areaRangeUnit'] = 'N/A'

    #try:
    #    plot_area = html.xpath(
    #        '//i[@id="super_areaLabel"]/text()')[0].extract()
    #    obj['plot_area'] = plot_area.split(':')[1].strip()
    #except:
    #    obj['plot_area'] = 'N/A'


    try:
        obj['postedOn'] = html.xpath(
            '//span[@class="rf PostdByPd mt3 f13 "]/text()')[0].extract().split(':')[1].strip()
    except:
        try:
            obj['postedOn'] = html.xpath(
                '//span[@class="rf PostdByPd mt3 f13 blk"]/text()')[0].extract().split(':')[1].strip()
        except:
            obj['postedOn'] = 'N/A'

    try:
        obj['available_from'] = html.xpath('//i[@id="availabilityLabel"]/following-sibling::i[1]/text()')[0].extract().split(':')[1].strip()
    except:
        obj['available_from'] = 'N/A'

    try:
        obj['property_age'] = html.xpath('//i[@id="ageLabel"]/following-sibling::i[1]/text()')[0].extract().split(':')[1].strip()
    except:
        obj['property_age'] = 'N/A'

    try:
        obj['property_ownership'] = html.xpath('//i[@id="owntypeLabel"]/following-sibling::i[1]/text()')[0].extract().split(':')[1].strip()
    except:
        obj['property_ownership'] = 'N/A'
    try:
        obj['transaction_type'] = html.xpath('//i[@id="transact_typeLabel"]/following-sibling::i[1]/text()')[0].extract().split(':')[1].strip()
    except:
        obj['transaction_type'] = 'N/A'

    try:
        obj['bedroom'] = html.xpath('//div[@id="bedroom_numLabel"]/b/text()')[0].extract().split(':')[1].strip()
    except:
        obj['bedroom'] = 'N/A'

    try:
        obj['bathroom'] = html.xpath('//span[@id="bathroom_numLabel"]/following-sibling::b[1]/text()')[0].extract().split(':')[1].strip()
    except:
        obj['bathroom'] = 'N/A'

    try:
        obj['posted_by'] = html.xpath('//span[@id="ContactTabPd"]/text()')[0].extract().split('Details')[0].strip()
    except:
        obj['posted_by'] = 'N/A'

    try:
        obj['posted_by_name'] = str(html.xpath('//div[@class="f16 lf b"]').re(r"Send enquiry to (.*)</div>")[0])
    except:
        obj['posted_by_name'] = 'N/A'

    try:
        features = html.xpath('//ul[@class="ameN"]/li/text()').extract()
        features = [ str(x) for x in features ]
        obj['features'] = ' | '.join(features)
    except:
        obj['features'] = 'N/A'

    return obj
    # print obj


def dump_page(start_url, filename):
    global final_dump
    try:
        response = requests.get(start_url).text
        print start_url
    except Exception as e1:
        print e1

    html = Selector(text=response)
    properties = html.xpath('//div[@class="srpWrap "]')

    for p_detail in properties:
        try:
            obj = fun(
                p_detail.xpath('.//div[@class="wrapttl"]/div/a/@href')[0].extract())
            final_dump.append(obj)
        except Exception as e:
            print e
            pass



def number_of_pages(start_url):
    print start_url
    try:
        response = requests.get(start_url + '1').text
        html = Selector(text=response)
        pages = html.xpath('//a[@class="pgsel"]/text()').extract()
        pages = [ int(x) for x in pages ]
        # pages = 2
        return max(pages)
    except:
        return 0


def dump_pages(start_url, filename):
    global final_dump
    final_dump = []
    pages = number_of_pages(start_url + "1")
    #pages = 1
    print "number of pages: " + str(pages)
    threads = []
    for page in range(1, pages + 1):
        threads.append(
            threading.Thread(target=dump_page, args=[start_url + str(page), filename]))
    concurrent = 20
    size = len(threads) / concurrent + 1
    print size
    for i in range(size):
        todo = threads[i * concurrent:(i + 1) * concurrent]
        for t in todo:
            t.start()
        for t in todo:
            t.join()

    f = open(filename, 'w')
    f.write(json_csv(final_dump))
    f.close()


def json_csv(data):
    keys = []
    csv_data = ''
    for item in data:
        for key in item:
            keys.append(key.encode('utf-8'))
    keys = list(set(keys))
    # print keys
    csv_data += '"%s"\n' % '","'.join(keys)
    for row in data:
        values = []
        for key in keys:
            value_temp = row.get(key.decode('utf-8'))
            if type(value_temp) is list:
                value_temp = str(";".join(value_temp))
            values.append((value_temp or "N/A").encode('utf-8'))

        csv_data += '"%s"\n' % '","'.join(values)
    return csv_data


def main():
    # city_list = ['mumbai','bangalore', 'hyderabad','pune', 'chennai','delhi-ncr','kolkata','gurgaon', 'noida','ghaziabad', 'faridabad']
    city_list = ['mumbai','bangalore']
    # ['pune', 'chennai', 'kolkata', 'bangalore', 'hyderabad',
    #              'gurgaon', 'noida', 'delhi-ncr', 'ghaziabad', 'faridabad']

    for city_name in city_list:
        print city_name
        start_url = 'http://www.99acres.com/property-in-' + \
            str(city_name) + '-ffid-page-'
        dump_file_name = '99acres_buy_' + str(city_name) + '.csv'
        dump_pages(start_url, dump_file_name)

main()
