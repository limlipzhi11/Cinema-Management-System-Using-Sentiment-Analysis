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
    consumerKey=config("CONSUMER_KEY")
    consumerSecret=config("CONSUMER_SECRET")
    access_token=config("ACCESS_TOKEN")
    access_secret=config("ACCESS_SECRET")

    auth=tweepy.OAuthHandler(consumerKey,consumerSecret)
    auth.set_access_token(access_token,access_secret)
    return tweepy.API(auth)

def pull_tweets(keyword,numTweets,api,movie_id,startFrom):
    if startFrom != 0:
        tweets = tweepy.Cursor(api.search, q=keyword, lang="en", since_id=startFrom, count=numTweets).items(numTweets)
    else:
        tweets = tweepy.Cursor(api.search, q=keyword, lang="en", count=numTweets).items(numTweets)

    numPosTweet=numNegTweet=0
    polarity=0
    tweet_list=[]
    posTweet_list=[]
    negTweet_list=[]
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
    posTweet_list = pandas.DataFrame(posTweet_list)
    negTweet_list = pandas.DataFrame(negTweet_list)
    tweet_list.drop_duplicates(inplace=True)
    clean_tweets = pandas.DataFrame(tweet_list)
    clean_tweets["text"]=clean_tweets[0]
    retweet_remove = lambda x: re.sub('RT @\w+: ', " ", x)
    regex = lambda x: re.sub("(@[A-Za-z0–9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", x)
    clean_tweets["text"] = clean_tweets.text.map(retweet_remove).map(regex)
    clean_tweets["text"] = clean_tweets.text.str.lower()

    clean_tweets["Cleaned"] = clean_tweets["text"].apply(lambda x: cleanText(x))

    #print(clean_tweets['Cleaned'])

    clean_tweets[['polarity', 'subjectivity']] = clean_tweets[0]\
        .apply(lambda Text:pandas.Series(TextBlob(Text).sentiment))
    for index,row in clean_tweets[0].iteritems():
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
    #clean_tweets['text_len']=clean_tweets['text'].astype(str).apply(len)
    #clean_tweets['text_word_count']=clean_tweets['text'].apply(lambda x:len(str(x).split()))
    #print(round(pandas.DataFrame(clean_tweets.groupby("sentiment").text_len.mean()),2))
    #print(round(pandas.DataFrame(clean_tweets.groupby("sentiment").text_word_count.mean()),2))
    #clean_tweets['punctuation']=clean_tweets['text'].apply(lambda x:removePunctuation(x))
    #clean_tweets['tokenized']=clean_tweets['punctuation'].apply(lambda x: tokenize(x.lower()))

    #Remove later
    #porterStemmer = nltk.PorterStemmer()
    #stopword = nltk.corpus.stopwords.words('english')

    #clean_tweets["nonstop"]=clean_tweets['tokenized'].apply(lambda x:remove_stopwords(x,stopword))


    #clean_tweets['stemmed']=clean_tweets["nonstop"].apply(lambda x:stemming(x,porterStemmer))




    #countVectorizer=CountVectorizer(analyzer=cleanText)
    #countVector=countVectorizer.fit_transform(clean_tweets['text'])

    #countVector_df=pandas.DataFrame(countVector.toarray(),columns=countVectorizer.get_feature_names())

    #count=pandas.DataFrame(countVector_df.sum())
    #countdf=count.sort_values(0,ascending=False).head(20)
    #print(clean_tweets["Cleaned"])
    #print(clean_tweets["text"])


def countColumnNum(data,column):
    total=data.loc[:,column].value_counts(dropna=False)
    percent=round(data.loc[:,column].value_counts(dropna=False,normalize=True)*100,2)
    return pandas.concat([total,percent],axis=1,keys=['Total','Percentage'])

def removePunctuation(text):
    text="".join([char for char in text if char not in string.punctuation])
    text=re.sub('[0-9]+','',text)
    return text

def tokenize(text):
    return re.split('\W+',text)

def remove_stopwords(text,stopword):
    text=[word for word in text if word not in stopword]
    return text

def stemming(text,porterStemmer):
    text=[porterStemmer.stem(word) for word in text]
    return text

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
    pull_tweets(title,100,api,movieId,startFrom)

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
