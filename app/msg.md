Below is one common way to switch your local changes into a separate branch and push them (instead of pushing to `main`):

1. **Create (or switch to) a new branch** from `main`:
   ```bash
   git checkout -b feat/artifacts
   ```
   - This command creates and checks out a new branch named `feat/artifacts` based on your `main` branch.

2. **Add and commit your changes** if you haven’t already:
   ```bash
   git add .
   git commit -m "Add artifacts feature"
   ```

3. **Push the new branch** to your remote repository:
   ```bash
   git push -u origin feat/artifacts
   ```
   - The `-u` (or `--set-upstream`) flag sets your local `feat/artifacts` branch to track the `feat/artifacts` branch on the remote repository named `origin`. 
   
After this, you’ll have all of your changes on the `feat/artifacts` branch in your remote repository without touching `main`. If you need to open a pull request, you can do so from `feat/artifacts` into `main` on your remote (e.g., GitHub or GitLab).

```rust
fn fibonacci(n: u32) -> u32 {
    if n < 2 {
        n
    } else {
        fibonacci(n - 1) + fibonacci(n - 2)
    }
}

fn main() {
    let number = 10;
    println!("Fibonacci of {}: {}", number, fibonacci(number));
}
```

end.