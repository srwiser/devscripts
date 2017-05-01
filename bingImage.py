#!/usr/bin/env python
import urllib
import json
import urlparse
import os
import logging
import sqlite3
import PIL
from PIL import ImageFont
from PIL import Image
from PIL import ImageDraw

bing_source_url = "http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US"
bing_base_url = "http://www.bing.com"
bing_image_url = ""
local_file_name = 'background.jpg'
local_file_name_with_out_copyright = 'background_without_copyright.jpg'
LOG_FILENAME = "imageFetch.log"
DB_NAME = os.environ["HOME"] + "/Library/Application Support/Dock/desktoppicture.db"

abs_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),local_file_name)
abs_file_path_with_out_copyright = os.path.join(os.path.dirname(os.path.abspath(__file__)),local_file_name_with_out_copyright)
logging.basicConfig(filename=os.path.join(os.path.dirname(os.path.abspath(__file__)),LOG_FILENAME),level=logging.DEBUG,format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Get Image from Bing
with open(abs_file_path_with_out_copyright,'w') as local_file:
  try:
    # Get Data
    f =  urllib.urlopen(bing_source_url)
    source_data = json.loads(f.read())
    copyright = source_data['images'][0]['copyright']
    bing_image_url = urlparse.urljoin( bing_base_url,source_data['images'][0]['url'])
    response = urllib.urlopen(bing_image_url)
    imageData = response.read()

    # Write data
    local_file.write(imageData)
    local_file.close()
    #Add text to image
    font = ImageFont.truetype("/Library/Fonts/Times New Roman.ttf",25)
    # Opening the file gg.png
    img1=Image.open(abs_file_path_with_out_copyright)
    # Drawing the text on the picture
    draw = ImageDraw.Draw(img1)
    text_width, text_height = draw.textsize(copyright, font)
    x = img1.width - text_width
    y = img1.height - text_height
    draw.text((x/2,y*0.9),copyright,(255,255,255),font=font)
    draw = ImageDraw.Draw(img1)
    # Save the image with a new name
    img1.save(abs_file_path)
    # Change background
    # DATABASE
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('UPDATE data set value = "' + abs_file_path + '";')
    conn.commit()
    conn.close()

    os.system('killall Dock')

  except IOError as e:
    logging.debug("I/O error({0}): {1}".format(e.errno, e.strerror))
  except ValueError:
    logging.debug("Couldn't convert data")
  except OSError as err:
    logging.debug("OS error: {0}".format(err))
  except:
    logging.debug("Unexpected error")

