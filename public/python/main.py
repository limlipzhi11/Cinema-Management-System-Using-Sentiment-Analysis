#Imports
from textblob import TextBlob
import sys
import tweepy
import matplotlib.pyplot
import pandas
import numpy
import os
import nltk
import re
import string
import MySQLdb
import math
from decouple import config

from PIL import Image
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from langdetect import detect
from nltk.stem import SnowballStemmer
from sklearn.feature_extraction.text import CountVectorizer

def authenticate():
    con_key=config("CONSUMER_KEY")
    con_secret=config("CONSUMER_SECRET")
    access_token=config("ACCESS_TOKEN")
    access_secret=config("ACCESS_SECRET")

    auth=tweepy.OAuthHandler(con_key,con_secret)
    auth.set_access_token(access_token,access_secret)
    return tweepy.API(auth)

def analyze_tweets(keyword,numTweets,api,movie_id,startFrom):
    if startFrom != 0:
        tweets = tweepy.Cursor(api.search, q=keyword, lang="en", since_id=startFrom, count=numTweets).items(numTweets)
    else:
        tweets = tweepy.Cursor(api.search, q=keyword, lang="en", count=numTweets).items(numTweets)

    tweet_list=[]
    since_list=[]
    db=MySQLdb.connect("localhost", "root", "", "cinema_system")
    cursor=db.cursor()

    for tweet in tweets:
        try:
            tweet_list.append(tweet.text)
            since_list.append(tweet.id)
        except Exception as e:
            print(e)

    tweet_list = pandas.DataFrame(tweet_list)
    tweet_list.drop_duplicates(inplace=True)
    clean_tweets = pandas.DataFrame(tweet_list)
    clean_tweets["text"]=clean_tweets[0]
    retweet_remove = lambda x: re.sub('RT @\w+: ', " ", x)
    regex = lambda x: re.sub("(@[A-Za-z0–9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", x)
    clean_tweets["text"] = clean_tweets.text.map(retweet_remove).map(regex)
    clean_tweets["text"] = clean_tweets.text.str.lower()

    clean_tweets["cleaned"] = clean_tweets["text"].apply(lambda x: cleanText(x))

    #print(clean_tweets['Cleaned'])

    clean_tweets[['polarity', 'subjectivity']] = clean_tweets["cleaned"].apply(lambda Text:pandas.Series(TextBlob(Text).sentiment))
    for index,row in clean_tweets["cleaned"].iteritems():
        polarity_score = SentimentIntensityAnalyzer().polarity_scores(row)
        negative = polarity_score['neg']
        positive = polarity_score['pos']
        compound = polarity_score['compound']
        if negative>positive:
            clean_tweets.loc[index,'sentiment']="Negative"
        elif positive>negative:
            clean_tweets.loc[index,"sentiment"]="Positive"
        clean_tweets.loc[index,"neg"]=negative
        clean_tweets.loc[index, "pos"] = positive
        clean_tweets.loc[index, "compound"] = compound

    posTweet_list=clean_tweets[clean_tweets["sentiment"]=="Positive"]
    negTweet_list=clean_tweets[clean_tweets['sentiment']=="Negative"]
    #print(countColumnNum(clean_tweets,'sentiment'))
    totalCompound=0;

    avgCompound=1/(1+math.exp(-(clean_tweets['compound'].sum()/clean_tweets.shape[0])))
    totalpos=posTweet_list.shape[0]
    totalneg=negTweet_list.shape[0]
    sinceID=since_list[len(since_list)-1]
    totalTweets=clean_tweets.shape[0]
    #print(avgCompound)
    sqlquery="insert into movie_sentiment(movie_id,no_pos,no_neg,avg_comp,since_id) values({},{},{},{},{})".format(movie_id,totalpos,totalneg,avgCompound,sinceID)
    cursor.execute(sqlquery)
    db.commit()

def cleanText(text):
    Stemmer = nltk.SnowballStemmer(language="english")
    stopword = nltk.corpus.stopwords.words('english')
    text_lc="".join([word.lower() for word in text if word not in string.punctuation])
    text_rc=re.sub('[0-9]+','',text_lc)
    tokens=re.split('\W+',text_rc)

    text=[Stemmer.stem(word) for word in tokens if word not in stopword]
    text=" ".join(text)
    return text
# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    api=authenticate()
    title = sys.argv[1]
    movieId = sys.argv[2]
    startFrom = sys.argv[3]
    analyze_tweets(title,100,api,movieId,startFrom)

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
