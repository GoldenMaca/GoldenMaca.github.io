import os
import shutil

for i in os.listdir("~/Desktop"):
    item_path = os.path.join("~/Desktop", i)
    if os.path.isfile(item_path):
            os.remove(item_path)
            
        elif os.path.islink(item_path):
            os.unlink(item_path)
    
dummy_dir = "~/Desktop'
print(f"\nContents of '{dummy_dir}' after removal:")
for item in os.listdir(dummy_dir):
    print(f"- {item}")


shutil.rmtree(dummy_dir)
print(f"\nCleaned up dummy directory: {dummy_dir}")
