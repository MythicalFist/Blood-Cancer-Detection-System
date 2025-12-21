import pandas as pd
import numpy as np

# Set random seed for reproducibility
np.random.seed(42)

# Number of samples
n_samples = 3000

# Randomly generate data
data = {
    'Gender': np.random.choice(['Male', 'Female'], n_samples),
    'Age': np.random.randint(18, 90, n_samples),
    'WBC': np.random.uniform(3000, 50000, n_samples),
    'Hgb': np.random.uniform(5, 18, n_samples),
    'Platelet': np.random.uniform(50000, 600000, n_samples),
    'RBC': np.random.uniform(2.5, 6.5, n_samples),
    'HCT': np.random.uniform(20, 55, n_samples),
    'MCV': np.random.uniform(60, 110, n_samples),
    'Neutrophil': np.random.uniform(20, 90, n_samples),
    'Lymphocyte': np.random.uniform(10, 80, n_samples)
}

df = pd.DataFrame(data)

# Risk Label Logic (Simplified Rule-based for 'dummy' ground truth)
# High Risk if WBC > 20000 or Platelet < 100000 or (Hgb < 10 and WBC > 15000)
# Low Risk otherwise, Moderate in between
conditions = [
    (df['WBC'] > 20000) | (df['Platelet'] < 100000),
    (df['WBC'] > 11000) & (df['WBC'] <= 20000),
]
choices = ['High Risk', 'Moderate Risk']
df['Risk_Label'] = np.select(conditions, choices, default='Low Risk')

# Save to Excel
output_file = 'blood_cancer_dataset.xlsx'
try:
    df.to_excel(output_file, index=False)
    print(f"Dataset created successfully: {output_file}")
except ImportError as e:
    print(f"Error: {e}")
    print("Please install openpyxl: pip install openpyxl")
except Exception as e:
    print(f"An error occurred: {e}")
