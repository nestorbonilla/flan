# Project: Flan ~ flow analysis on disaggregated data on bilateral trade using Golem
# Author: Nestor Bonilla
# For more information about the datasets used in this project, please visit: 
# http://www.cepii.fr/CEPII/en/bdd_modele/presentation.asp?id=37

import pandas as pd
import numpy as np
import math
import json
import matplotlib.pyplot as plt
import seaborn as sns

# GETTING PARAMETERS ~ PRODUCTION
file_params_name = "golem/work/params.json"
file_params = open (file_params_name, "r")
params = json.loads(file_params.read())
first_year = params["first_year"]
last_year = params["last_year"]
count = params["count"]
# In this project we use the internation ISO3 code.
origin_code = params["origin_code"]
# The available clasifications in this project are 06D and 04D
# 06D has a more detailed classification of product and services - 6 digits
#code_type = "04D"
#code_type = "06D"
code_type = params["code_type"]
resource_directory = "golem/resources"
output_directory = "golem/resources"

# GETTING PARAMETERS ~ DEVELOPMENT
# first_year = "2012"
# last_year = "2018"
# count = "10"
# origin_code = "PAN"
# code_type = "04D"
# resource_directory = "datasets"
# output_directory = "datasets"

code_6_width = 6
code_4_width = 4
code_2_width = 2
code_country_width = 4

country_grrms_list = []
world_grrms_list = []
cagr_list = []
agwms_list = []

# Assign filename: file
file_first_year = f"{resource_directory}/BACI_04D_Y{first_year}_V202001.csv"
file_last_year = f"{resource_directory}/BACI_04D_Y{last_year}_V202001.csv"
file_country_code = f"{resource_directory}/BACI_HS92_COUNTRY_CODE.csv"

# This file has all 2 and 4 digit code products
file_product_code = f"{resource_directory}/BACI_HS_PRODUCT_CODE.csv"

# For the 4 digit code products we will use this file, because it contains
# a short description of products
file_product_code_4d = f"{resource_directory}/BACI_HS4D_PRODUCT_CODE.csv"

# Import file: data
data_first_year = pd.read_csv(file_first_year, sep=',', comment='#', na_values=['Nothing'])
data_last_year = pd.read_csv(file_last_year, sep=',', comment='#', na_values=['Nothing'])
data_country_code = pd.read_csv(file_country_code, sep=',', comment='#', na_values=['Nothing'])
data_country_code["origin"] = data_country_code["i"].astype(str).str.zfill(code_country_width)
data_product_code_4d = pd.read_csv(file_product_code_4d, sep=',', comment='#', na_values=['Nothing'])

data_first_year["hs4"] = data_first_year["hs4"].astype(str).str.zfill(code_4_width)
data_first_year["origin"] = data_first_year["origin"].astype(str).str.zfill(code_4_width)
data_last_year["hs4"] = data_last_year["hs4"].astype(str).str.zfill(code_4_width)
data_last_year["origin"] = data_last_year["origin"].astype(str).str.zfill(code_4_width)

data_world_first_year = data_first_year.groupby(["hs4"]).agg({"export_val":"sum"}).reset_index()
sum_world_first_year = data_world_first_year["export_val"].sum()

data_world_last_year = data_last_year.groupby(["hs4"]).agg({"export_val":"sum"}).reset_index()
sum_world_last_year = data_world_last_year["export_val"].sum()

data_product_code_04 = data_product_code_4d.copy()
data_product_code_04["hs4"] = data_product_code_4d["hs92"].astype(str).str.zfill(code_4_width)

data_frame = pd.DataFrame(list(data_product_code_04["hs4"]), columns=["hs4"])

data_frame = data_frame[["hs4"]].merge(data_first_year[["hs4", "origin", "export_val"]], on="hs4")
data_frame = data_frame.rename(columns = {"export_val":"country_first_year"})

data_frame = pd.merge(data_frame, data_world_first_year, on=["hs4"])
data_frame = data_frame.rename(columns = {"export_val":"world_first_year"})

data_frame = pd.merge(data_frame, data_last_year, on=["hs4","origin"])
data_frame = data_frame.rename(columns = {"export_val":"country_last_year"})

data_frame = pd.merge(data_frame, data_world_last_year, on=["hs4"])
data_frame = data_frame.rename(columns = {"export_val":"world_last_year"})

data_frame["country_first_year"] = round(data_frame["country_first_year"] / 1000, 0)
data_frame["country_last_year"] = round(data_frame["country_last_year"] / 1000, 0)
data_frame["world_first_year"] = round(data_frame["world_first_year"] / 1000, 0)
data_frame["world_last_year"] = round(data_frame["world_last_year"] / 1000, 0)

for (index_label, row_series) in data_frame.iterrows():
    
    # 1. COUNTRY GRRMS

    # country_first_year /world_first_year
    if row_series.values[2] / row_series.values[3] == 0.0:
        temp_1 = 1.0
    else:
        temp_1 = row_series.values[2] / row_series.values[3]

    # country_last_year / world_last_year
    if (row_series.values[4] / row_series.values[5]) / temp_1 == 0.0:
        temp_2 = 1.0
    else:
        temp_2 = (row_series.values[4] / row_series.values[5]) / temp_1

    country_grrms = round(
        math.exp(
            math.log(
                temp_2 / 4) - 1) * 100
        , 0)
    country_grrms_list.append(country_grrms)

    # 2. WORLD GRRMS

    # world_first_year / sum_world_first_year
    if row_series.values[3] / sum_world_first_year == 0.0:
        temp_1 = 1.0
    else:
        temp_1 = row_series.values[3] / sum_world_first_year
    
    # world_last_year / sum_world_last_year
    if (row_series.values[5] / sum_world_last_year) / temp_1 == 0.0:
        temp_2 = 1.0
    else:
        temp_2 = (row_series.values[5] / sum_world_last_year) / temp_1
    
    world_grrms = round(
        math.exp(
            math.log(
                temp_2 / 4) - 1) * 100
        , 0)
    world_grrms_list.append(world_grrms)

    # 3. CAGR

    # country_first_year * country_last_year
    if float(row_series.values[2]) * float(row_series.values[4]) > 0:
        cagr = round((
            pow(
                float(row_series.values[4]) / float(row_series.values[2]),
                1.00 / (float(last_year) - float(first_year))
            ) - 1
        ) * 100, 0)
    else:
        cagr = 0.0
    cagr_list.append(cagr)

    # 4. AGWMS
    agwms = round((
            pow(
                # world_last_year / world_first_year
                float(row_series.values[5]) / float(row_series.values[3]),
                1.00 / (float(last_year) - float(first_year))
            ) - 1
        ) * 100, 0)
    agwms_list.append(agwms)
    
data_frame["country_grrms"] = country_grrms_list
data_frame["world_grrms"] = world_grrms_list
data_frame["cagr"] = cagr_list
data_frame["agwms"] = agwms_list

# ADDING COUNTRIES
data_frame = data_frame[["hs4", "origin", "country_first_year", "world_first_year", "country_last_year", "world_last_year", "country_grrms", "world_grrms", "cagr", "agwms"]].merge(data_country_code[["country", "iso3", "origin"]], on="origin")
data_frame["origin_code"]= data_frame["iso3"]
data_frame["origin_name"]= data_frame["country"]

# ADDING PRODUCT DESCRIPTION
data_frame = data_frame[["hs4", "origin_code", "origin_name", "country_first_year", "world_first_year", "country_last_year", "world_last_year", "country_grrms", "world_grrms", "cagr", "agwms"]].merge(data_product_code_04[["hs4", "short_name"]], on="hs4")

data_by_country = data_frame[data_frame["origin_code"] == origin_code]
data_baci_results = data_by_country.sort_values(by=['country_last_year'], ascending=False).head(int(count)).reset_index()

colors = sns.color_palette("Accent", 10)
fig, ax = plt.subplots()

for (index, row_values) in data_baci_results.iterrows():
    x = row_values["agwms"]
    y = row_values["cagr"]
    scale = row_values["country_last_year"]
    label = row_values["short_name"]
    color = np.array([colors[index]])
    scatter = ax.scatter(x = x, y = y, c = color, s = scale, label = label)

ax.grid(True)
plt.title('Growth-Share Matrix - Golem Hackathon')
plt.xlabel('Growth in demand')
plt.ylabel('Annual growth rate')
plt.legend(bbox_to_anchor=(1,1), loc="upper left", title="Products")
chartBox = ax.get_position()
ax.set_position([chartBox.x0, chartBox.y0, chartBox.width*0.6, chartBox.height])
plt.axvline(0, c=(.5, .5, .5), ls="--")
plt.axhline(0, c=(.5, .5, .5), ls="--")

# Saving result
data_baci_results.to_csv(f"{output_directory}/baci_result.csv")
plt.savefig(f"{output_directory}/baci_plot.png")