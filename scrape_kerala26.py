import os
import csv
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

BASE_URL = "https://kerala26.com"
IMAGE_DIR = "kerala26_all_images"

os.makedirs(IMAGE_DIR, exist_ok=True)

def download_image(img_url, name_prefix):
    if not img_url: return None
    full_url = urljoin(BASE_URL, img_url)
    filename = os.path.basename(full_url.split('?')[0])
    safe_prefix = "".join([c for c in name_prefix if c.isalpha() or c.isdigit()]).rstrip()
    if not safe_prefix: safe_prefix = "img"
    save_path = os.path.join(IMAGE_DIR, f"{safe_prefix}_{filename}")
    
    if os.path.exists(save_path): return save_path
        
    try:
        response = requests.get(full_url, stream=True, timeout=10)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return save_path
    except Exception:
        pass
    return None

def scrape_constituency(constituency_id):
    url = f"{BASE_URL}/constituency/{constituency_id}"
    print(f"Crawling: {url}...")
    
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    try:
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code != 200:
            print(f"  -> Failed (Status: {response.status_code})")
            return None
    except Exception as e:
        print(f"  -> Error: {e}")
        return None

    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Initialize basic data dictionary
    data = {
        "Constituency_ID": constituency_id, 
        "URL": url,
        "Constituency_Name": "Unknown",
        "District": "Unknown",
        "2026_LDF_Candidate": "N/A", "2026_LDF_Party": "N/A",
        "2026_UDF_Candidate": "N/A", "2026_UDF_Party": "N/A",
        "2026_NDA_Candidate": "N/A", "2026_NDA_Party": "N/A",
        "2026_OTH_Candidates": "",
    }

    # 1. Extract District & Name
    h1 = soup.find('h1')
    data["Constituency_Name"] = h1.get_text(strip=True) if h1 else "Unknown"
    for p in soup.find_all('p'):
        if "Constituency #" in p.get_text():
            parts = p.get_text().split('·')
            if len(parts) > 1:
                data["District"] = parts[1].strip()
            break

    # 2. Extract 2026 Candidates (Reading plain text from the DOM)
    text_elements = [el.strip() for el in soup.stripped_strings if el.strip()]
    
    try:
        # Find the block where 2026 candidates are listed
        start_idx = text_elements.index("2026 Candidates")
        end_idx = len(text_elements)
        
        # Stop looking once we reach the 2021 historical data
        for i in range(start_idx, len(text_elements)):
            if text_elements[i] in ["2021 Detailed Results", "Detailed Results", "Current MLA (2021)"]:
                end_idx = i
                break
        
        cand_block = text_elements[start_idx:end_idx]
        oth_list = []
        
        # Parse the block looking for Front labels
        for i, text in enumerate(cand_block):
            if text in ['LDF', 'UDF', 'NDA', 'OTH']:
                front = text
                if i + 1 < len(cand_block):
                    name = cand_block[i+1] # The element immediately after Front is the Candidate Name
                    
                    party_offset = 2
                    if i + 2 < len(cand_block) and cand_block[i+2] == "SITTING MLA":
                        party_offset = 3 # Shift one over if they are the sitting MLA
                        
                    party = cand_block[i+party_offset] if i + party_offset < len(cand_block) else "Unknown"
                    
                    if front in ['LDF', 'UDF', 'NDA']:
                        if data[f"2026_{front}_Candidate"] == "N/A": # Prevent duplicates
                            data[f"2026_{front}_Candidate"] = name
                            data[f"2026_{front}_Party"] = party
                    elif front == 'OTH':
                        oth_list.append(f"{name} ({party})")
                        
        if oth_list:
            data["2026_OTH_Candidates"] = " | ".join(oth_list)

    except ValueError:
        pass # "2026 Candidates" label missing

    # 3. Extract 2021 Historical Demographics
    text_dump = " | ".join(text_elements)
    def extract_stat(label):
        if label in text_elements:
            idx = text_elements.index(label)
            if idx + 1 < len(text_elements):
                return text_elements[idx+1]
        return "N/A"

    data["2021_Margin"] = extract_stat("Margin")
    data["2021_Electors"] = extract_stat("Electors")
    data["2021_Turnout"] = extract_stat("Turnout")
    data["2021_NOTA"] = extract_stat("NOTA")
    data["2021_Rejected"] = extract_stat("Rejected")

    # 4. Extract 2021 Winner / Runner-up from tables
    tables = soup.find_all('table')
    for table in tables:
        headers = [th.get_text(strip=True).lower() for th in table.find_all('th')]
        rows = table.find_all('tr')[1:]
        if 'evm' in headers and 'postal' in headers and len(rows) > 0:
            top_cols = rows[0].find_all(['td', 'th'])
            if len(top_cols) >= 6:
                data["2021_Winner_Front"] = top_cols[1].get_text(strip=True)
                data["2021_Winner_Name"] = top_cols[2].get_text(strip=True)
                data["2021_Winner_TotalVotes"] = top_cols[5].get_text(strip=True)
            if len(rows) > 1:
                runner_cols = rows[1].find_all(['td', 'th'])
                if len(runner_cols) >= 6:
                    data["2021_RunnerUp_Name"] = runner_cols[2].get_text(strip=True)
                    data["2021_RunnerUp_TotalVotes"] = runner_cols[5].get_text(strip=True)

    # 5. Image Extraction
    images = soup.find_all('img')
    saved_images = []
    for img in images:
        src = img.get('src')
        if src and any(src.lower().split('?')[0].endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.svg']):
            saved_path = download_image(src, f"Const_{constituency_id}")
            if saved_path: saved_images.append(saved_path)
    
    data["Local_Images"] = " | ".join(list(set(saved_images)))
    return data

def main():
    print("Starting crawler with Visible Text Parsing for 2026 Candidates...")
    all_data = []
    
    # Loop through constituencies 1 to 140
    for i in range(1, 141):
        data = scrape_constituency(i)
        if data:
            all_data.append(data)
        time.sleep(1) # Be polite to the server

    if not all_data:
        print("No data scraped.")
        return

    csv_file = "kerala_2026_and_2021_master_data.csv"
    
    # Sorting headers
    sorted_fieldnames = ["Constituency_ID", "Constituency_Name", "District", 
                         "2026_LDF_Candidate", "2026_LDF_Party", 
                         "2026_UDF_Candidate", "2026_UDF_Party", 
                         "2026_NDA_Candidate", "2026_NDA_Party", "2026_OTH_Candidates",
                         "2021_Winner_Front", "2021_Winner_Name", "2021_Winner_TotalVotes",
                         "2021_RunnerUp_Name", "2021_RunnerUp_TotalVotes",
                         "2021_Margin", "2021_Electors", "2021_Turnout", "2021_NOTA", "2021_Rejected",
                         "URL", "Local_Images"]

    all_keys = set()
    for d in all_data: all_keys.update(d.keys())
    fieldnames = [f for f in sorted_fieldnames if f in all_keys] + [k for k in all_keys if k not in sorted_fieldnames]

    with open(csv_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_data)
        
    print(f"\n✅ Crawl complete! 2026 Candidates extracted successfully.")
    print(f"✅ Data saved to: {csv_file}")

if __name__ == "__main__":
    main()