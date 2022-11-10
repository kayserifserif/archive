import requests

URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRg5FVCk83wl4ScdDo3IM_M698aBuvtz9jgN40ceD_Ey8-jqOxsuNp9swUjnovb03TrzzD6OFdlUF5Y/pub?gid=1990955331&single=true&output=tsv"
PATH = "archive.tsv"

if __name__ == "__main__":
  response = requests.get(URL)
  with open(PATH, "wb") as f:
    f.write(response.content)
    print("done!")