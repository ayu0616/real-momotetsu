import pandas as pd

day_length = 3  # 日数を記入
days = [f'day{i+1}' for i in range(day_length)]

for day in days:
    df = pd.read_excel('./schedule.xlsx', sheet_name=day)
    df_trans = df.T
    df_trans.to_json(f'{day}.json', force_ascii=False)
