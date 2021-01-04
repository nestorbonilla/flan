FROM python:3

RUN apt-get update && \
 	apt-get install -y \
    python3-pip && \
 	apt-get -y autoremove && \
 	rm -rf /var/lib/apt/lists/*

RUN python3 -m pip install pandas numpy matplotlib seaborn 

COPY datasets/BACI_04D_Y2012_V202001.csv /golem/resources/
COPY datasets/BACI_04D_Y2013_V202001.csv /golem/resources/
COPY datasets/BACI_04D_Y2014_V202001.csv /golem/resources/
COPY datasets/BACI_04D_Y2015_V202001.csv /golem/resources/
COPY datasets/BACI_04D_Y2016_V202001.csv /golem/resources/
COPY datasets/BACI_04D_Y2017_V202001.csv /golem/resources/
COPY datasets/BACI_04D_Y2018_V202001.csv /golem/resources/
COPY datasets/BACI_HS92_COUNTRY_CODE.csv /golem/resources/
COPY datasets/BACI_HS4D_PRODUCT_CODE.csv /golem/resources/
COPY calculation.py /golem/work/
COPY run-flan.sh /golem/work/

#For test purposes
COPY datasets/TEST_VALUES.csv /golem/output/

# TO TRY DOCKER RUN IN LOCAL
# COPY params.json golem/work/params.json
# CMD ["golem/work/calculation.py"]
# ENTRYPOINT ["python3"]

VOLUME /golem/work /golem/output /golem/resources