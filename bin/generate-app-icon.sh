#!/usr/bin/env bash

#
# Original work (c) ECOLE POLYTECHNIQUE FEDERALE DE LAUSANNE, Switzerland, VPSI, 2017-2018.
# Modified work (c) William Belle, 2018-2022.
# See the LICENSE file for more details.
#

which convert > /dev/null
if [ 0 -ne $? ]; then echo -e 'convert not found. Install Image Magick'; exit 1; fi

which optipng > /dev/null
if [ 0 -ne $? ]; then echo -e 'optipng not found. Install optipng'; exit 1; fi

size=(128 48 16)
for ((i=0; i < ${#size[@]}; i++))
do
  convert -density 300 -flip -resize "${size[$i]}"x"${size[$i]}" -background none docs/gimp/target.svg src/images/icon-"${size[$i]}".png
done
