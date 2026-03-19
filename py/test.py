import os
os.system("cd ~")
os.system("/Applications/Lightspeed\\ Agent.app/Contents/MacOS/Lightspeed\\ Agent -h")
os.system("xattr -dr com.apple.quarantine /Users/1012317/Downloads/WarThunderLauncher.app")
os.system("xattr -cr /Users/1012317/Downloads/WarThunderLauncher.app")
os.system("xattr -d com.apple.quarantine /Users/1012317/Downloads/WarThunderLauncher.app")

print("success")
