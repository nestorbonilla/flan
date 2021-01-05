#FROM python:3
FROM golemfactory/base:1.8

VOLUME /golem/work /golem/output /golem/resources

RUN apt-get update && \
 	apt-get install -y \
    python3-pip && \
 	apt-get -y autoremove && \
 	rm -rf /var/lib/apt/lists/*

RUN python3 -m pip install pandas numpy matplotlib seaborn

COPY datasets/BACI_04D_Y2012_V202001.csv /golem/resources/BACI_04D_Y2012_V202001.csv
COPY datasets/BACI_04D_Y2013_V202001.csv /golem/resources/BACI_04D_Y2013_V202001.csv
COPY datasets/BACI_04D_Y2014_V202001.csv /golem/resources/BACI_04D_Y2014_V202001.csv
COPY datasets/BACI_04D_Y2015_V202001.csv /golem/resources/BACI_04D_Y2015_V202001.csv
COPY datasets/BACI_04D_Y2016_V202001.csv /golem/resources/BACI_04D_Y2016_V202001.csv
COPY datasets/BACI_04D_Y2017_V202001.csv /golem/resources/BACI_04D_Y2017_V202001.csv
COPY datasets/BACI_04D_Y2018_V202001.csv /golem/resources/BACI_04D_Y2018_V202001.csv
COPY datasets/BACI_HS92_COUNTRY_CODE.csv /golem/resources/BACI_HS92_COUNTRY_CODE.csv
COPY datasets/BACI_HS4D_PRODUCT_CODE.csv /golem/resources/BACI_HS4D_PRODUCT_CODE.csv
COPY calculation.py /golem/work/calculation.py
COPY run_flan.sh /golem/work/run_flan.sh

# for testing purposes
# COPY params.json /golem/work/params.json