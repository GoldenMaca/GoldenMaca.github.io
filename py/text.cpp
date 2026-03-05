// Compile: g++ text.c++ -std=c++17 -lSDL2 -o open10windows
#include <SDL2/SDL.h>
#include <vector>
#include <string>
#include <cstdlib>
#include <ctime>

struct Win { SDL_Window* w = nullptr; SDL_Renderer* r = nullptr; };

int main() {
    if (SDL_Init(SDL_INIT_VIDEO) != 0) return 1;
    SDL_Window* control = SDL_CreateWindow("Click or press any key to open 10 windows",
                                           SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
                                           420, 160, SDL_WINDOW_SHOWN);
    if (!control) { SDL_Quit(); return 1; }

    std::vector<Win> wins;
    bool opened = false;
    bool running = true;
    SDL_Event e;
    std::srand((unsigned)std::time(nullptr));

    while (running) {
        while (SDL_PollEvent(&e)) {
            if (e.type == SDL_QUIT) { running = false; break; }

            if (!opened && (e.type == SDL_MOUSEBUTTONDOWN || e.type == SDL_KEYDOWN)) {
                opened = true;
                // create 10 windows arranged in two rows of five
                for (int i = 0; i < 10; ++i) {
                    int x = 100 + (i % 5) * 250;
                    int y = 100 + (i / 5) * 220;
                    std::string title = "Window " + std::to_string(i + 1);
                    SDL_Window* w = SDL_CreateWindow(title.c_str(), x, y, 220, 180, SDL_WINDOW_SHOWN);
                    SDL_Renderer* r = SDL_CreateRenderer(w, -1, SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);
                    wins.push_back({w, r});
                    // paint a random background color
                    Uint8 rc = std::rand() % 256, gc = std::rand() % 256, bc = std::rand() % 256;
                    SDL_SetRenderDrawColor(r, rc, gc, bc, 255);
                    SDL_RenderClear(r);
                    SDL_RenderPresent(r);
                }
            }

            if (e.type == SDL_WINDOWEVENT && e.window.event == SDL_WINDOWEVENT_CLOSE) {
                Uint32 id = e.window.windowID;
                // close corresponding child window (not the control one)
                for (auto it = wins.begin(); it != wins.end(); ++it) {
                    if (SDL_GetWindowID(it->w) == id) {
                        SDL_DestroyRenderer(it->r);
                        SDL_DestroyWindow(it->w);
                        wins.erase(it);
                        break;
                    }
                }
                // if control closed, exit
                if (SDL_GetWindowID(control) == id) running = false;
            }
        }

        // optional: redraw child windows (keeps them responsive)
        for (auto &wn : wins) {
            // nothing dynamic here, but present to keep window contents steady
            SDL_RenderPresent(wn.r);
        }

        SDL_Delay(16);
    }

    for (auto &wn : wins) {
        if (wn.r) SDL_DestroyRenderer(wn.r);
        if (wn.w) SDL_DestroyWindow(wn.w);
    }
    if (control) SDL_DestroyWindow(control);
    SDL_Quit();
    return 0;
}