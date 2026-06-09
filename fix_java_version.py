import os

def fix_gradle_file(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace VERSION_21 with VERSION_17
    fixed_content = content.replace("JavaVersion.VERSION_21", "JavaVersion.VERSION_17")
    
    if fixed_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f"Fixed: {file_path}")
    else:
        print(f"No changes needed: {file_path}")

# Run for our project gradle files
fix_gradle_file(r"android\app\capacitor.build.gradle")
fix_gradle_file(r"android\capacitor-cordova-android-plugins\build.gradle")
fix_gradle_file(r"node_modules\@capacitor\android\capacitor\build.gradle")
