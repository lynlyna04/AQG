from farasa.pos import FarasaPOSTagger

tagger = FarasaPOSTagger(interactive=True)

text = "ذهبت الطالبة إلى المدرسة وكتبت درسها."
tags = tagger.tag(text)

for word, tag in tags:
    print(word, tag)
