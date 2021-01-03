# This file has been used to reduce the size of the original BACI files
# by grouping values from 6 to 4 digit codes.

import pandas as pd

resource_directory = "datasets"
output_directory = "datasets"
year = "2017"
code_6_width = 6
code_country_width = 4

file_year = f"{resource_directory}/BACI_HS12_Y{year}_V202001.csv"
data_year = pd.read_csv(file_year, sep=',', comment='#', na_values=['Nothing'])

data_year["hs4"] = data_year["k"].astype(str).str.zfill(code_6_width).apply(lambda x: x[0:4])
data_year["origin"] = data_year["i"].astype(str).str.zfill(code_country_width)
data_year["export_val"]= data_year["v"]
new_values = data_year.groupby(["origin", "hs4"]).agg({"export_val":"sum"}).reset_index()
new_values.to_csv(f"{output_directory}/BACI_04D_Y{year}_V202001.csv", index=False)