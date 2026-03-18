fn main() {
    uniffi::generate_scaffolding("src/bdk.udl").expect("Failed to generate UniFFI scaffolding");
}
