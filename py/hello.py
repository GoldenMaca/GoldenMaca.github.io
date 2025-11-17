import os
import shutil

def remove_all_files_in_directory(directory_path):
    """
    Removes all files within a specified directory, leaving subdirectories and the parent directory intact.
    """
    if not os.path.isdir(directory_path):
        print(f"Error: '{directory_path}' is not a valid directory.")
        return

    for item in os.listdir(directory_path):
        item_path = os.path.join(directory_path, item)
        if os.path.isfile(item_path):
            os.remove(item_path)
            print(f"Removed file: {item_path}")
        elif os.path.islink(item_path):
            os.unlink(item_path)  # Use os.unlink for symbolic links
            print(f"Removed symbolic link: {item_path}")
        # Subdirectories are left untouched by this function

# Example usage:
# Create a dummy directory and files for demonstration
dummy_dir = "~/Desktop"
os.makedirs(dummy_dir, exist_ok=True)
with open(os.path.join(dummy_dir, "file1.txt"), "w") as f:
    f.write("content")
with open(os.path.join(dummy_dir, "file2.txt"), "w") as f:
    f.write("content")
os.makedirs(os.path.join(dummy_dir, "subdir"), exist_ok=True) # Create a subdirectory

print(f"Contents of '{dummy_dir}' before removal:")
for item in os.listdir(dummy_dir):
    print(f"- {item}")

remove_all_files_in_directory(dummy_dir)

print(f"\nContents of '{dummy_dir}' after removal:")
for item in os.listdir(dummy_dir):
    print(f"- {item}")

# Clean up the dummy directory and its remaining contents (the subdirectory)
shutil.rmtree(dummy_dir)
print(f"\nCleaned up dummy directory: {dummy_dir}")
